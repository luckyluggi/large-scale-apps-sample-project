import { 
    I{{ entityPlural }}ApiClientUrls, 
    I{{ entityPlural }}ApiClient, 
    {{ entityPlural }}ApiClient 
} from '@/models/api-client/{{ lowerCase entityPlural }}/I{{ entityPlural }}ApiClient'

const urls: I{{ entityPlural }}ApiClientUrls = {
	fetch{{ entityPlural }}: '/static/data/{{ lowerCase entityPlural }}.json'
}

const {{ lowerCase entityPlural }}ApiClient: I{{ entityPlural }}ApiClient = new {{ entityPlural }}ApiClient(urls)

export default {{ lowerCase entityPlural }}ApiClient
