import { TicketCreatedListener} from '../ticket-created-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {OrderStatus, ExpirationCompleteEvent} from '@iddqdkfatickets/common'
import mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {Ticket} from '../../../models/ticket';
import {ExpirationCompleteListener} from '../expiration-complete-listener';
import {Order} from '../../../models/order';

const setup = async () => {

const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });

    await ticket.save();
    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'kdlfgn',
        expiresAt: new Date(),
        ticket,

    })

    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }
    
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
        
    }
    return{listener, ticket, data, msg, order}

}


it('Updates the order status to cancelled', async () => {
    const {listener, ticket, data, msg, order} = await setup();

    await listener.onMessage(data, msg);

    const updateOrder = await Order.findById(order.id);

    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);

})

it('Emits an ordercancelled event', async () => {

    const {listener, ticket, data, msg, order} = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

   const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

   expect(eventData.id).toEqual(order.id);



})


it('Acks the message', async () => {

    const {listener, ticket, data, msg, order} = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})