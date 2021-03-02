import { SimpleEmail } from "../model/SimpleEmail";

export interface MailSender {
    send(email: SimpleEmail): Promise<any>
}
