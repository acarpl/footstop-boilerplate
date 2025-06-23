import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
  const address = new Address();
  address.nameAddress = createAddressDto.name_address;
  return this.addressRepository.save(address);
}


  findAll(): Promise<Address[]> {
    return this.addressRepository.find();
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressRepository.findOneBy({ id });
    if (!address) {
      throw new NotFoundException(`Address with ID #${id} not found`);
    }
    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.addressRepository.preload({
      id,
      ...updateAddressDto,
    });
    if (!address) {
      throw new NotFoundException(`Address with ID #${id} not found`);
    }
    return this.addressRepository.save(address);
  }

  async remove(id: number): Promise<Address> {
    const address = await this.findOne(id);
    return this.addressRepository.remove(address);
  }
}
