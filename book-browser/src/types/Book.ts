// src/types/Book.ts

/**
 * Root response for a Volume item from the Google Books API
 */
export interface Book {
    kind: string;
    id: string;
    etag: string;
    selfLink: string;
    volumeInfo: VolumeInfo;
    saleInfo: SaleInfo;
    accessInfo: AccessInfo;
    searchInfo?: SearchInfo;
}

/**
 * Detailed information about a book volume
 */
export interface VolumeInfo {
    title: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: IndustryIdentifier[];
    readingModes?: ReadingModes;
    pageCount?: number;
    printType?: string;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    maturityRating?: string;
    allowAnonLogging?: boolean;
    contentVersion?: string;
    panelizationSummary?: PanelizationSummary;
    imageLinks?: ImageLinks;
    language?: string;
    previewLink?: string;
    infoLink?: string;
    canonicalVolumeLink?: string;
}

export interface IndustryIdentifier {
    type: string;
    identifier: string;
}

export interface ReadingModes {
    text: boolean;
    image: boolean;
}

export interface PanelizationSummary {
    containsEpubBubbles: boolean;
    containsImageBubbles: boolean;
}

export interface ImageLinks {
    smallThumbnail?: string;
    thumbnail?: string;
    small?: string;
    medium?: string;
    large?: string;
    extraLarge?: string;
}

export interface SaleInfo {
    country: string;
    saleability: string;
    isEbook: boolean;
    listPrice?: Price;
    retailPrice?: Price;
    buyLink?: string;
    offers?: Offer[];
}

export interface Price {
    amount: number;
    currencyCode: string;
}

export interface Offer {
    finskyOfferType: number;
    listPrice: Price;
    retailPrice: Price;
}

export interface AccessInfo {
    country: string;
    viewability: string;
    embeddable: boolean;
    publicDomain: boolean;
    textToSpeechPermission: string;
    epub: FormatAvailability;
    pdf: FormatAvailability;
    webReaderLink: string;
    accessViewStatus: string;
    quoteSharingAllowed: boolean;
}

export interface FormatAvailability {
    isAvailable: boolean;
    acsTokenLink?: string;
}

export interface SearchInfo {
    textSnippet: string;
}
