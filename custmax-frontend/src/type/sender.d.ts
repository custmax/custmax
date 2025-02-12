declare module Sender {
  type SaveSender = {
    serverType?: string,
    email: string,
    id: number,
    imapPort?: number,
    imapServer?: string,
    password: string,
    smtpPort?: number,
    smtpServer?: string,
    imapEncryption?: string,
    smtpEncryption?: string,
    popEncryption?: string,
  }
}