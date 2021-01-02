import {Publisher, OrderCancelledEvent, Subjects} from '@iddqdkfatickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

