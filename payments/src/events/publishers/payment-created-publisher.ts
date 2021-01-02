import {Subjects, Publisher, PaymentCreatedEvent} from '@iddqdkfatickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}