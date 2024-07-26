import { Attachment } from '../../models/Attachment'

export type AttachmentTag = { type: typeof AttachmentTagType; id: string }
export const AttachmentTagType = 'Attachment'

export const attachmentTagProvider: (attachments: Attachment[] | undefined) => AttachmentTag[] = attachments =>
	!!attachments
		? attachments.map(attachment => {
				return { type: AttachmentTagType, id: attachment._id }
		  })
		: []
