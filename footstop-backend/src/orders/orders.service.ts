import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto";
import { Order } from "./entities/order.entity";
import { OrdersDetail } from "../orders-details/entities/orders-detail.entity";
import { Cart } from "../carts/entities/cart.entity";
import { User } from "../users/entities/user.entity";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly dataSource: DataSource // Inject DataSource untuk transaksi
  ) {}

  async findOneForAdmin(id_order: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id_order },
      // Ini adalah bagian kunci: kita memuat semua relasi yang dibutuhkan
      relations: [
        "user", // Ambil data user
        "order_details", // Ambil daftar item detail
        "order_details.product", // Di setiap item detail, ambil juga data produknya
        "order_details.product.images", // Ambil juga gambar produknya
      ],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID #${id_order} not found.`);
    }
    return order;
  }

  async create(user: User, createOrderDto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Ambil semua item dari keranjang user
      const cartItems = await this.cartRepository.find({
        where: { user: { id_user: user.id_user } },
        relations: ["product"],
      });

      if (cartItems.length === 0) {
        throw new BadRequestException("Your cart is empty.");
      }

      // 2. Hitung total harga
      const total_price = cartItems.reduce((sum, item) => {
        return sum + item.quantity * item.product.price;
      }, 0);

      // 3. Buat entitas Order utama
      const newOrder = this.orderRepository.create({
        user,
        address: createOrderDto.address,
        fullName: createOrderDto.fullName, // <-- Gunakan data baru
        phoneNumber: createOrderDto.phoneNumber, // <-- Gunakan data baru
        total_price: total_price,
      });
      const savedOrder = await queryRunner.manager.save(newOrder);
      // 4. Buat entitas Order Details dari setiap item di keranjang
      const orderDetails = cartItems.map((item) => {
        return queryRunner.manager.create(OrdersDetail, {
          order: savedOrder,
          product: item.product,
          quantity: item.quantity,
          size: item.size,
          price_per_unit: item.product.price,
          subtotal: item.quantity * item.product.price,
        });
      });
      await queryRunner.manager.save(orderDetails);

      // 5. Kosongkan keranjang user
      await queryRunner.manager.remove(cartItems);

      // Jika semua berhasil, commit transaksi
      await queryRunner.commitTransaction();

      return savedOrder;
    } catch (err) {
      // Jika ada satu saja error, batalkan semua perubahan
      await queryRunner.rollbackTransaction();
      throw err; // Lempar kembali errornya
    } finally {
      // Selalu lepaskan queryRunner
      await queryRunner.release();
    }
  }

  findAllForUser(id_user: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id_user } },
      order: { order_date: "DESC" }, // Urutkan dari yang terbaru
    });
  }

  async findOneForUser(id_user: number, id_order: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id_order, user: { id_user } },
      relations: ["orderDetails", "orderDetails.product"], // Muat detail dan produknya
    });

    if (!order) {
      throw new NotFoundException(`Order with ID #${id_order} not found.`);
    }
    return order;
  }

  async findAllForAdmin(p0: { page: number; limit: number }): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ["user"], // Muat juga data user yang memesan
      order: { order_date: "DESC" },
    });
  }

  async updateStatus(idOrder: number, newStatus: string): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id_order: idOrder });
    if (!order) {
      throw new NotFoundException(`Order with ID #${idOrder} not found.`);
    }

    order.status_pengiriman = newStatus;
    return this.orderRepository.save(order);
  }
}
