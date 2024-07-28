import { Attachment } from './Attachment'

export interface ProfilePicture extends Attachment {
	content: string
	type: string
}
