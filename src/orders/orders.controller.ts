import {
  Controller,
  Get,
  Post,
  Param,
  Inject,
  Query,
  ParseUUIDPipe,
  Patch,
  Body,
} from '@nestjs/common';
import { ClientProxy, Payload, RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { ORDER_SERVICE } from 'src/config/services';
import { catchError } from 'rxjs';
import { OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  ParseUUIDPipe;
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersClient.send('findAllOrders', orderPaginationDto);
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersClient.send('findOneOrder', { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
    //Promises
    // try {
    //   const order = await firstValueFrom(
    //     this.ordersClient.send('findOneOrder', { id }),
    //   );
    //   return order;
    // } catch (error) {
    //   throw new RpcException(error);
    // }
  }
  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.ordersClient
      .send('findAllOrders', { ...paginationDto, status: statusDto.status })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Patch(':id')
  async ChangeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    return this.ordersClient
      .send('changeOrderStatus', {
        id,
        status: statusDto.status,
      })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
