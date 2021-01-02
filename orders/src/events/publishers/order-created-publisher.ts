import {Publisher, OrderCreatedEvent, Subjects} from '@iddqdkfatickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

