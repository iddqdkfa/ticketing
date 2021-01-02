import {Publisher, ExpirationCompleteEvent, Subjects} from '@iddqdkfatickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

