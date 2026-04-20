import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties
} from 'n8n-workflow';

export class PingramApi implements ICredentialType {
  name = 'pingramApi';
  displayName = 'Pingram API';
  documentationUrl = 'https://pingram.io/docs';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Your Pingram API key (starts with pingram_sk_...)'
    },
    {
      displayName: 'Region',
      name: 'region',
      type: 'options',
      options: [
        {
          name: 'US (Default)',
          value: 'us'
        },
        {
          name: 'Canada',
          value: 'ca'
        },
        {
          name: 'EU',
          value: 'eu'
        }
      ],
      default: 'us',
      description: 'The Pingram API region to use'
    }
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '={{"Bearer " + $credentials.apiKey}}'
      }
    }
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{$credentials.region === "ca" ? "https://api.ca.pingram.io" : $credentials.region === "eu" ? "https://api.eu.pingram.io" : "https://api.pingram.io"}}',
      url: '/users',
      method: 'GET'
    }
  };
}
