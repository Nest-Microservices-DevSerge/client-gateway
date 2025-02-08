import { Controller, Get, Post, Param, Inject, Query } from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { CreateOrderDto } from 'src/common/dto/create-order.dto';
import { ORDER_SERVICE } from 'src/config/services';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ordersClient.send('findAllOrders', paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersClient.send('findOneOrder', id);
  }
}
