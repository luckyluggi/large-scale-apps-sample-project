import { 
    I{{ entityPlural }}ApiClientUrls, 
    I{{ entityPlural }}ApiClient, 
    {{ entityPlural }}ApiClient 
} from '@/models/api-client/{{ lowerCase entityPlural }}/I{{ entityPlural }}ApiClient'

const urls: I{{ entityPlural }}ApiClientUrls = {
	fetch{{ entityPlural }}: '/path/to/your/real/api/and-point'
}

const {{ lowerCase entityPlural }}ApiClient: I{{ entityPlural }}ApiClient = new {{ entityPlural }}ApiClient(urls)

export default {{ lowerCase entityPlural }}ApiClient