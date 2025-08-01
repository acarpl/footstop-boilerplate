PGDMP  4                    }            footstop    17.5    17.5 c    :           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            ;           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            <           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            =           1262    16388    footstop    DATABASE        CREATE DATABASE footstop WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE footstop;
                     postgres    false            �            1259    16417    address    TABLE     a   CREATE TABLE public.address (
    id_address integer NOT NULL,
    name_address text NOT NULL
);
    DROP TABLE public.address;
       public         heap r       postgres    false            �            1259    16416    address_id_address_seq    SEQUENCE     �   CREATE SEQUENCE public.address_id_address_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.address_id_address_seq;
       public               postgres    false    224            >           0    0    address_id_address_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.address_id_address_seq OWNED BY public.address.id_address;
          public               postgres    false    223            �            1259    16399    brands    TABLE     n   CREATE TABLE public.brands (
    id_brand integer NOT NULL,
    brand_name character varying(100) NOT NULL
);
    DROP TABLE public.brands;
       public         heap r       postgres    false            �            1259    16398    brands_id_brand_seq    SEQUENCE     �   CREATE SEQUENCE public.brands_id_brand_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.brands_id_brand_seq;
       public               postgres    false    220            ?           0    0    brands_id_brand_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.brands_id_brand_seq OWNED BY public.brands.id_brand;
          public               postgres    false    219            �            1259    16479    carts    TABLE     �   CREATE TABLE public.carts (
    id_cart integer NOT NULL,
    id_user integer NOT NULL,
    id_product integer NOT NULL,
    size character varying(50),
    quantity integer NOT NULL,
    CONSTRAINT carts_quantity_check CHECK ((quantity > 0))
);
    DROP TABLE public.carts;
       public         heap r       postgres    false            �            1259    16478    carts_id_cart_seq    SEQUENCE     �   CREATE SEQUENCE public.carts_id_cart_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.carts_id_cart_seq;
       public               postgres    false    232            @           0    0    carts_id_cart_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.carts_id_cart_seq OWNED BY public.carts.id_cart;
          public               postgres    false    231            �            1259    16408 
   categories    TABLE     x   CREATE TABLE public.categories (
    id_category integer NOT NULL,
    category_name character varying(100) NOT NULL
);
    DROP TABLE public.categories;
       public         heap r       postgres    false            �            1259    16407    categories_id_category_seq    SEQUENCE     �   CREATE SEQUENCE public.categories_id_category_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.categories_id_category_seq;
       public               postgres    false    222            A           0    0    categories_id_category_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.categories_id_category_seq OWNED BY public.categories.id_category;
          public               postgres    false    221            �            1259    16465    gambar    TABLE     �   CREATE TABLE public.gambar (
    id_gambar integer NOT NULL,
    id_product integer NOT NULL,
    url text NOT NULL,
    id_user integer
);
    DROP TABLE public.gambar;
       public         heap r       postgres    false            �            1259    16464    gambar_id_gambar_seq    SEQUENCE     �   CREATE SEQUENCE public.gambar_id_gambar_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.gambar_id_gambar_seq;
       public               postgres    false    230            B           0    0    gambar_id_gambar_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.gambar_id_gambar_seq OWNED BY public.gambar.id_gambar;
          public               postgres    false    229            �            1259    16497    orders    TABLE     =  CREATE TABLE public.orders (
    id_order integer NOT NULL,
    id_user integer NOT NULL,
    order_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    address text NOT NULL,
    total_price numeric(14,2) NOT NULL,
    status_pengiriman character varying(50) DEFAULT 'Pending'::character varying NOT NULL
);
    DROP TABLE public.orders;
       public         heap r       postgres    false            �            1259    16513    orders_details    TABLE       CREATE TABLE public.orders_details (
    id_order_details integer NOT NULL,
    id_order integer NOT NULL,
    id_product integer NOT NULL,
    quantity integer NOT NULL,
    price_per_unit numeric(12,2) NOT NULL,
    subtotal numeric(14,2) NOT NULL,
    size character varying(50)
);
 "   DROP TABLE public.orders_details;
       public         heap r       postgres    false            �            1259    16512 #   orders_details_id_order_details_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_details_id_order_details_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 :   DROP SEQUENCE public.orders_details_id_order_details_seq;
       public               postgres    false    236            C           0    0 #   orders_details_id_order_details_seq    SEQUENCE OWNED BY     k   ALTER SEQUENCE public.orders_details_id_order_details_seq OWNED BY public.orders_details.id_order_details;
          public               postgres    false    235            �            1259    16496    orders_id_order_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_id_order_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.orders_id_order_seq;
       public               postgres    false    234            D           0    0    orders_id_order_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.orders_id_order_seq OWNED BY public.orders.id_order;
          public               postgres    false    233            �            1259    16530    payments    TABLE       CREATE TABLE public.payments (
    id_payment integer NOT NULL,
    id_order integer NOT NULL,
    payment_method character varying(50) NOT NULL,
    payment_date timestamp with time zone,
    payment_status character varying(50) DEFAULT 'Pending'::character varying NOT NULL
);
    DROP TABLE public.payments;
       public         heap r       postgres    false            �            1259    16529    payments_id_payment_seq    SEQUENCE     �   CREATE SEQUENCE public.payments_id_payment_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.payments_id_payment_seq;
       public               postgres    false    238            E           0    0    payments_id_payment_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.payments_id_payment_seq OWNED BY public.payments.id_payment;
          public               postgres    false    237            �            1259    16447    products    TABLE     <  CREATE TABLE public.products (
    id_product integer NOT NULL,
    product_name character varying(255) NOT NULL,
    id_brand integer NOT NULL,
    id_category integer NOT NULL,
    size character varying(50),
    price numeric(12,2) NOT NULL,
    CONSTRAINT products_price_check CHECK ((price >= (0)::numeric))
);
    DROP TABLE public.products;
       public         heap r       postgres    false            �            1259    16446    products_id_product_seq    SEQUENCE     �   CREATE SEQUENCE public.products_id_product_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.products_id_product_seq;
       public               postgres    false    228            F           0    0    products_id_product_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.products_id_product_seq OWNED BY public.products.id_product;
          public               postgres    false    227            �            1259    16390    role    TABLE     i   CREATE TABLE public.role (
    id_role integer NOT NULL,
    nama_role character varying(50) NOT NULL
);
    DROP TABLE public.role;
       public         heap r       postgres    false            �            1259    16389    role_id_role_seq    SEQUENCE     �   CREATE SEQUENCE public.role_id_role_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.role_id_role_seq;
       public               postgres    false    218            G           0    0    role_id_role_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.role_id_role_seq OWNED BY public.role.id_role;
          public               postgres    false    217            �            1259    16426    users    TABLE     O  CREATE TABLE public.users (
    id_user integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(100) NOT NULL,
    phone_number character varying(20),
    id_role integer NOT NULL,
    id_address integer,
    "refreshTokenHash" character varying(255)
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    16425    users_id_user_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.users_id_user_seq;
       public               postgres    false    226            H           0    0    users_id_user_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.users_id_user_seq OWNED BY public.users.id_user;
          public               postgres    false    225            V           2604    16420    address id_address    DEFAULT     x   ALTER TABLE ONLY public.address ALTER COLUMN id_address SET DEFAULT nextval('public.address_id_address_seq'::regclass);
 A   ALTER TABLE public.address ALTER COLUMN id_address DROP DEFAULT;
       public               postgres    false    224    223    224            T           2604    16402    brands id_brand    DEFAULT     r   ALTER TABLE ONLY public.brands ALTER COLUMN id_brand SET DEFAULT nextval('public.brands_id_brand_seq'::regclass);
 >   ALTER TABLE public.brands ALTER COLUMN id_brand DROP DEFAULT;
       public               postgres    false    220    219    220            Z           2604    16482    carts id_cart    DEFAULT     n   ALTER TABLE ONLY public.carts ALTER COLUMN id_cart SET DEFAULT nextval('public.carts_id_cart_seq'::regclass);
 <   ALTER TABLE public.carts ALTER COLUMN id_cart DROP DEFAULT;
       public               postgres    false    231    232    232            U           2604    16411    categories id_category    DEFAULT     �   ALTER TABLE ONLY public.categories ALTER COLUMN id_category SET DEFAULT nextval('public.categories_id_category_seq'::regclass);
 E   ALTER TABLE public.categories ALTER COLUMN id_category DROP DEFAULT;
       public               postgres    false    221    222    222            Y           2604    16468    gambar id_gambar    DEFAULT     t   ALTER TABLE ONLY public.gambar ALTER COLUMN id_gambar SET DEFAULT nextval('public.gambar_id_gambar_seq'::regclass);
 ?   ALTER TABLE public.gambar ALTER COLUMN id_gambar DROP DEFAULT;
       public               postgres    false    230    229    230            [           2604    16500    orders id_order    DEFAULT     r   ALTER TABLE ONLY public.orders ALTER COLUMN id_order SET DEFAULT nextval('public.orders_id_order_seq'::regclass);
 >   ALTER TABLE public.orders ALTER COLUMN id_order DROP DEFAULT;
       public               postgres    false    233    234    234            ^           2604    16516    orders_details id_order_details    DEFAULT     �   ALTER TABLE ONLY public.orders_details ALTER COLUMN id_order_details SET DEFAULT nextval('public.orders_details_id_order_details_seq'::regclass);
 N   ALTER TABLE public.orders_details ALTER COLUMN id_order_details DROP DEFAULT;
       public               postgres    false    236    235    236            _           2604    16533    payments id_payment    DEFAULT     z   ALTER TABLE ONLY public.payments ALTER COLUMN id_payment SET DEFAULT nextval('public.payments_id_payment_seq'::regclass);
 B   ALTER TABLE public.payments ALTER COLUMN id_payment DROP DEFAULT;
       public               postgres    false    237    238    238            X           2604    16450    products id_product    DEFAULT     z   ALTER TABLE ONLY public.products ALTER COLUMN id_product SET DEFAULT nextval('public.products_id_product_seq'::regclass);
 B   ALTER TABLE public.products ALTER COLUMN id_product DROP DEFAULT;
       public               postgres    false    227    228    228            S           2604    16393    role id_role    DEFAULT     l   ALTER TABLE ONLY public.role ALTER COLUMN id_role SET DEFAULT nextval('public.role_id_role_seq'::regclass);
 ;   ALTER TABLE public.role ALTER COLUMN id_role DROP DEFAULT;
       public               postgres    false    218    217    218            W           2604    16429    users id_user    DEFAULT     n   ALTER TABLE ONLY public.users ALTER COLUMN id_user SET DEFAULT nextval('public.users_id_user_seq'::regclass);
 <   ALTER TABLE public.users ALTER COLUMN id_user DROP DEFAULT;
       public               postgres    false    225    226    226            )          0    16417    address 
   TABLE DATA           ;   COPY public.address (id_address, name_address) FROM stdin;
    public               postgres    false    224   �v       %          0    16399    brands 
   TABLE DATA           6   COPY public.brands (id_brand, brand_name) FROM stdin;
    public               postgres    false    220   Cw       1          0    16479    carts 
   TABLE DATA           M   COPY public.carts (id_cart, id_user, id_product, size, quantity) FROM stdin;
    public               postgres    false    232   �w       '          0    16408 
   categories 
   TABLE DATA           @   COPY public.categories (id_category, category_name) FROM stdin;
    public               postgres    false    222   �w       /          0    16465    gambar 
   TABLE DATA           E   COPY public.gambar (id_gambar, id_product, url, id_user) FROM stdin;
    public               postgres    false    230   �w       3          0    16497    orders 
   TABLE DATA           h   COPY public.orders (id_order, id_user, order_date, address, total_price, status_pengiriman) FROM stdin;
    public               postgres    false    234   �y       5          0    16513    orders_details 
   TABLE DATA           z   COPY public.orders_details (id_order_details, id_order, id_product, quantity, price_per_unit, subtotal, size) FROM stdin;
    public               postgres    false    236   0z       7          0    16530    payments 
   TABLE DATA           f   COPY public.payments (id_payment, id_order, payment_method, payment_date, payment_status) FROM stdin;
    public               postgres    false    238   hz       -          0    16447    products 
   TABLE DATA           `   COPY public.products (id_product, product_name, id_brand, id_category, size, price) FROM stdin;
    public               postgres    false    228   �z       #          0    16390    role 
   TABLE DATA           2   COPY public.role (id_role, nama_role) FROM stdin;
    public               postgres    false    218   n{       +          0    16426    users 
   TABLE DATA           z   COPY public.users (id_user, username, password, email, phone_number, id_role, id_address, "refreshTokenHash") FROM stdin;
    public               postgres    false    226   �{       I           0    0    address_id_address_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.address_id_address_seq', 3, true);
          public               postgres    false    223            J           0    0    brands_id_brand_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.brands_id_brand_seq', 4, true);
          public               postgres    false    219            K           0    0    carts_id_cart_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.carts_id_cart_seq', 2, true);
          public               postgres    false    231            L           0    0    categories_id_category_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.categories_id_category_seq', 4, true);
          public               postgres    false    221            M           0    0    gambar_id_gambar_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.gambar_id_gambar_seq', 6, true);
          public               postgres    false    229            N           0    0 #   orders_details_id_order_details_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.orders_details_id_order_details_seq', 1, true);
          public               postgres    false    235            O           0    0    orders_id_order_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.orders_id_order_seq', 3, true);
          public               postgres    false    233            P           0    0    payments_id_payment_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.payments_id_payment_seq', 1, true);
          public               postgres    false    237            Q           0    0    products_id_product_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.products_id_product_seq', 10, true);
          public               postgres    false    227            R           0    0    role_id_role_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.role_id_role_seq', 2, true);
          public               postgres    false    217            S           0    0    users_id_user_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.users_id_user_seq', 6, true);
          public               postgres    false    225            p           2606    16424    address address_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (id_address);
 >   ALTER TABLE ONLY public.address DROP CONSTRAINT address_pkey;
       public                 postgres    false    224            h           2606    16406    brands brands_brand_name_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_brand_name_key UNIQUE (brand_name);
 F   ALTER TABLE ONLY public.brands DROP CONSTRAINT brands_brand_name_key;
       public                 postgres    false    220            j           2606    16404    brands brands_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id_brand);
 <   ALTER TABLE ONLY public.brands DROP CONSTRAINT brands_pkey;
       public                 postgres    false    220            |           2606    16485    carts carts_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id_cart);
 :   ALTER TABLE ONLY public.carts DROP CONSTRAINT carts_pkey;
       public                 postgres    false    232            l           2606    16415 '   categories categories_category_name_key 
   CONSTRAINT     k   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_category_name_key UNIQUE (category_name);
 Q   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_category_name_key;
       public                 postgres    false    222            n           2606    16413    categories categories_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id_category);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public                 postgres    false    222            z           2606    16472    gambar gambar_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.gambar
    ADD CONSTRAINT gambar_pkey PRIMARY KEY (id_gambar);
 <   ALTER TABLE ONLY public.gambar DROP CONSTRAINT gambar_pkey;
       public                 postgres    false    230            �           2606    16518 "   orders_details orders_details_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.orders_details
    ADD CONSTRAINT orders_details_pkey PRIMARY KEY (id_order_details);
 L   ALTER TABLE ONLY public.orders_details DROP CONSTRAINT orders_details_pkey;
       public                 postgres    false    236            ~           2606    16506    orders orders_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id_order);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public                 postgres    false    234            �           2606    16538    payments payments_id_order_key 
   CONSTRAINT     ]   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_id_order_key UNIQUE (id_order);
 H   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_id_order_key;
       public                 postgres    false    238            �           2606    16536    payments payments_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id_payment);
 @   ALTER TABLE ONLY public.payments DROP CONSTRAINT payments_pkey;
       public                 postgres    false    238            x           2606    16453    products products_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id_product);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public                 postgres    false    228            d           2606    16397    role role_nama_role_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_nama_role_key UNIQUE (nama_role);
 A   ALTER TABLE ONLY public.role DROP CONSTRAINT role_nama_role_key;
       public                 postgres    false    218            f           2606    16395    role role_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id_role);
 8   ALTER TABLE ONLY public.role DROP CONSTRAINT role_pkey;
       public                 postgres    false    218            r           2606    16435    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    226            t           2606    16431    users users_pkey 
   CONSTRAINT     S   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id_user);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    226            v           2606    16433    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public                 postgres    false    226            �           2606    16441    users fk_address    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_address FOREIGN KEY (id_address) REFERENCES public.address(id_address) ON DELETE SET NULL;
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT fk_address;
       public               postgres    false    226    4720    224            �           2606    16454    products fk_brand    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_brand FOREIGN KEY (id_brand) REFERENCES public.brands(id_brand) ON DELETE RESTRICT;
 ;   ALTER TABLE ONLY public.products DROP CONSTRAINT fk_brand;
       public               postgres    false    228    220    4714            �           2606    16459    products fk_category    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_category FOREIGN KEY (id_category) REFERENCES public.categories(id_category) ON DELETE RESTRICT;
 >   ALTER TABLE ONLY public.products DROP CONSTRAINT fk_category;
       public               postgres    false    228    222    4718            �           2606    16519    orders_details fk_order_details    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders_details
    ADD CONSTRAINT fk_order_details FOREIGN KEY (id_order) REFERENCES public.orders(id_order) ON DELETE CASCADE;
 I   ALTER TABLE ONLY public.orders_details DROP CONSTRAINT fk_order_details;
       public               postgres    false    234    236    4734            �           2606    16539    payments fk_order_payment    FK CONSTRAINT     �   ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk_order_payment FOREIGN KEY (id_order) REFERENCES public.orders(id_order) ON DELETE CASCADE;
 C   ALTER TABLE ONLY public.payments DROP CONSTRAINT fk_order_payment;
       public               postgres    false    4734    238    234            �           2606    16491    carts fk_product_cart    FK CONSTRAINT     �   ALTER TABLE ONLY public.carts
    ADD CONSTRAINT fk_product_cart FOREIGN KEY (id_product) REFERENCES public.products(id_product) ON DELETE CASCADE;
 ?   ALTER TABLE ONLY public.carts DROP CONSTRAINT fk_product_cart;
       public               postgres    false    4728    228    232            �           2606    16524 !   orders_details fk_product_details    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders_details
    ADD CONSTRAINT fk_product_details FOREIGN KEY (id_product) REFERENCES public.products(id_product) ON DELETE RESTRICT;
 K   ALTER TABLE ONLY public.orders_details DROP CONSTRAINT fk_product_details;
       public               postgres    false    4728    236    228            �           2606    16473    gambar fk_product_gambar    FK CONSTRAINT     �   ALTER TABLE ONLY public.gambar
    ADD CONSTRAINT fk_product_gambar FOREIGN KEY (id_product) REFERENCES public.products(id_product) ON DELETE CASCADE;
 B   ALTER TABLE ONLY public.gambar DROP CONSTRAINT fk_product_gambar;
       public               postgres    false    228    4728    230            �           2606    16436    users fk_role    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_role FOREIGN KEY (id_role) REFERENCES public.role(id_role) ON DELETE RESTRICT;
 7   ALTER TABLE ONLY public.users DROP CONSTRAINT fk_role;
       public               postgres    false    4710    218    226            �           2606    16486    carts fk_user_cart    FK CONSTRAINT     �   ALTER TABLE ONLY public.carts
    ADD CONSTRAINT fk_user_cart FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON DELETE CASCADE;
 <   ALTER TABLE ONLY public.carts DROP CONSTRAINT fk_user_cart;
       public               postgres    false    232    4724    226            �           2606    32768    gambar fk_user_image    FK CONSTRAINT     x   ALTER TABLE ONLY public.gambar
    ADD CONSTRAINT fk_user_image FOREIGN KEY (id_user) REFERENCES public.users(id_user);
 >   ALTER TABLE ONLY public.gambar DROP CONSTRAINT fk_user_image;
       public               postgres    false    230    4724    226            �           2606    16507    orders fk_user_order    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk_user_order FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON DELETE RESTRICT;
 >   ALTER TABLE ONLY public.orders DROP CONSTRAINT fk_user_order;
       public               postgres    false    234    4724    226            )   g   x�3����SpL���S-I�MT���S0�Q�J�N,*I�2+H�I�KOO�SN-Ʉ(21�QpJ�K)�K�2���)�K
�B2 \Z���X������ �z!J      %   2   x�3����N�2�tL�LI,�2�(�M�2��K-WpJ�I�KN����� �      1      x������ � �      '   M   x�3�*����KW��O-�2�tJ,�N-IJ�Ɂ
s�d���T�*�&f�s�pzdf��9��s��qqq �Vg      /   �  x����j�0�ϳX��j�,��h�@�. ƒ|itlײ�����)Y�BЀ���,cY�,S:R�\zW�c(�x�H��!���^�ZV��>1�X\�1���cp#E�N�\��!�8M*0���%J�T��ZLk"�<�'�:�Вԍ!_]��ZLC�=��G������"2x F)M�1��%U�_*��7��T��=�����l%!�ɛh��s�l�ǘ��7�J�R	�`��
�f0 �H��5��ˌ�8��~��n�wg���k�ןXYr�n-g_|�v��ě�EVL�	�J�:�-������m}l�<�O[*Ȼ�K�8���pUIA��[郧�7W�9-t+�^�gȷ��~�S�E�aNg���.�@qt�-�Q ��$Ѳa�����x���k^1ʪ<_���y�K�B� �T�)��O3��p�y��      3   c   x���@0 �����r��2�:X��A%���}6��1��]赦}p�� �$L[^�"'NﺗK2�7�6��$��G��.231ð/�IQ3)�~b�      5   (   x�3�4�4�4�4���400�30�46���2M��b���� v�      7   ,   x�3�4���-�I,IMQp�剕�1~����ɩ��\1z\\\ ��X      -   �   x�e��
�@����2��R�Cb]�\LRV%z�V,�~����zh�*�gc�t���CA�\�C"�<QQ��S�[u5��1��{|�pI��dC�pS�
��-.�U�M@���Z�7�R��p_[�JN[�b���%�Q6������B�(�{k�?,v1��,�	�^|����C�      #       x�3�LL����2�L.-.��M-����� Y��      +   �  x�U�[o�@���W���Y��B�و��
�`L��Y�rj��/ҵ��I&s�~��C��✘1�M�x�С@�At�A�؋
�"PN��q��د�ePM�%p���8��C�y��A��'!!�~����]���{����T�lj(�sN�)��v�h�Yh ѐ�.�j����|C�1U;��F�����=�ܯQ��"ʽ�'~J�!�W��~]>��U�/��#K�ge����]�iw�~�b���ŉeH�%1+{��N��z���؉��zn�Gd�|sJNp?����Ͼ�D�a����c�u���]��M ����H����Pj���T��[�aݪf9q&���5v�V�,��9O�d!R<U	w�-����`6��F�Q���"H\�@� I��v��B     