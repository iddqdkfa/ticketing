import { TicketUpdatedListener} from '../ticket-updated-listener';
import {natsWrapper} from '../../../nats-wrapper';
import {Listener, TicketUpdatedEvent} from '@iddqdkfatickets/common'
import mongoose from 'mongoose';
import {Message} from 'node-nats-streaming';
import {Ticket} from '../../../models/ticket';

const setup = async () => {

const listener = new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10
    
    });

    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version +1,
        id: ticket.id,
        title: 'New Concert',
        price: 999,
        userId: 'gfnfgfgf'
    
    };

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {msg, data, ticket, listener}


}

it('Finds and updates and saves a ticket', async () => {
    const {msg, data, ticket, listener} = await setup();

    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);


})

it("Acks the message", async () => {
    const {msg, data, ticket, listener} = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();


})

it('Does nto call ack if the event has skipped a version number', async () => {

    const {msg, data, ticket, listener} = await setup();

    data.version = 10;
    try{

        await listener.onMessage(data, msg);

    } catch (err){

    }

    expect(msg.ack).not.toHaveBeenCalled();



})