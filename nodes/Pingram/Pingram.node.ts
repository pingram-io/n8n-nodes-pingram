import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export class Pingram implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Pingram',
		name: 'pingram',
		icon: 'file:pingram.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Send SMS and Email notifications via Pingram',
		defaults: {
			name: 'Pingram',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'pingramApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'SMS',
						value: 'sms',
					},
					{
						name: 'Email',
						value: 'email',
					},
				],
				default: 'sms',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['sms', 'email'],
					},
				},
				options: [
					{
						name: 'Send',
						value: 'send',
						description: 'Send a message',
						action: 'Send a message',
					},
				],
				default: 'send',
			},
			// SMS Fields
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['send'],
					},
				},
				default: '',
				description: 'Unique identifier for the recipient user',
			},
			{
				displayName: 'Phone Number',
				name: 'phoneNumber',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['send'],
					},
				},
				default: '',
				placeholder: '+15005550006',
				description: 'Phone number in E.164 format (e.g., +15005550006)',
			},
			{
				displayName: 'Message',
				name: 'smsMessage',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['send'],
					},
				},
				default: '',
				description: 'The SMS message content',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFieldsSms',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['sms'],
						operation: ['send'],
					},
				},
				options: [
					{
						displayName: 'Notification Type',
						name: 'notificationType',
						type: 'string',
						default: '',
						description: 'ID of the notification type (e.g., "welcome_sms")',
					},
				],
			},
			// Email Fields
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send'],
					},
				},
				default: '',
				description: 'Unique identifier for the recipient user',
			},
			{
				displayName: 'Email Address',
				name: 'emailAddress',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send'],
					},
				},
				default: '',
				placeholder: 'user@example.com',
				description: 'Recipient email address',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send'],
					},
				},
				default: '',
				description: 'Email subject line',
			},
			{
				displayName: 'HTML Body',
				name: 'htmlBody',
				type: 'string',
				typeOptions: {
					rows: 5,
				},
				required: true,
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send'],
					},
				},
				default: '',
				description: 'HTML content of the email body',
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFieldsEmail',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['email'],
						operation: ['send'],
					},
				},
				options: [
					{
						displayName: 'Notification Type',
						name: 'notificationType',
						type: 'string',
						default: '',
						description: 'ID of the notification type (e.g., "welcome_email")',
					},
					{
						displayName: 'Preview Text',
						name: 'previewText',
						type: 'string',
						default: '',
						description: 'Preview/snippet text shown in inbox',
					},
					{
						displayName: 'Sender Email',
						name: 'senderEmail',
						type: 'string',
						default: '',
						description: 'Sender email address',
					},
					{
						displayName: 'Sender Name',
						name: 'senderName',
						type: 'string',
						default: '',
						description: 'Display name of sender',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const credentials = await this.getCredentials('pingramApi');

		const region = credentials.region as string;
		let baseUrl: string;
		if (region === 'ca') {
			baseUrl = 'https://api.ca.pingram.io';
		} else if (region === 'eu') {
			baseUrl = 'https://api.eu.pingram.io';
		} else {
			baseUrl = 'https://api.pingram.io';
		}

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'send') {
					const userId = this.getNodeParameter('userId', i) as string;

					interface RequestBody {
						type?: string;
						to: {
							id: string;
							email?: string;
							number?: string;
						};
						sms?: {
							message: string;
						};
						email?: {
							subject: string;
							html: string;
							senderName?: string;
							senderEmail?: string;
							previewText?: string;
						};
					}

					const body: RequestBody = {
						to: {
							id: userId,
						},
					};

					if (resource === 'sms') {
						const phoneNumber = this.getNodeParameter('phoneNumber', i) as string;
						const message = this.getNodeParameter('smsMessage', i) as string;
						const additionalFields = this.getNodeParameter('additionalFieldsSms', i) as {
							notificationType?: string;
						};

						body.to.number = phoneNumber;
						body.sms = {
							message,
						};

						if (additionalFields.notificationType) {
							body.type = additionalFields.notificationType;
						}
					} else if (resource === 'email') {
						const emailAddress = this.getNodeParameter('emailAddress', i) as string;
						const subject = this.getNodeParameter('subject', i) as string;
						const htmlBody = this.getNodeParameter('htmlBody', i) as string;
						const additionalFields = this.getNodeParameter('additionalFieldsEmail', i) as {
							notificationType?: string;
							senderName?: string;
							senderEmail?: string;
							previewText?: string;
						};

						body.to.email = emailAddress;
						body.email = {
							subject,
							html: htmlBody,
						};

						if (additionalFields.notificationType) {
							body.type = additionalFields.notificationType;
						}
						if (additionalFields.senderName) {
							body.email.senderName = additionalFields.senderName;
						}
						if (additionalFields.senderEmail) {
							body.email.senderEmail = additionalFields.senderEmail;
						}
						if (additionalFields.previewText) {
							body.email.previewText = additionalFields.previewText;
						}
					}

					const response = await this.helpers.httpRequest({
						method: 'POST' as IHttpRequestMethods,
						url: `${baseUrl}/send`,
						headers: {
							Authorization: `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					});

					returnData.push({
						json: response,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject);
			}
		}

		return [returnData];
	}
}
