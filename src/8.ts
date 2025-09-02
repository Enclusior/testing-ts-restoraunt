interface IBook {
    id: number,
    title: string,
    author: string,
    year: number,
    genre: string,
    pages: number,
    isAvailable: boolean
}

interface IAuthor {
    id: number,
    name: string,
    country: string,
    birthYear: number,
    books: IBook[]
}

interface ILibrary {
    id: number,
    name: string,
    address: string,
    books: IBook[],
    authors: IAuthor[]
}

type BookKeys = keyof IBook


const sampleBook: IBook = {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: 1925,
    genre: 'Fiction',
    pages: 180,
    isAvailable: true
}


type SampleBookType = typeof sampleBook

type StringProperties<T> = {
   [K in keyof T]: T[K] extends string ? K : never
}[keyof T]
type NumberProperties<T> = {
    [K in keyof T]: T[K] extends number ? K : never
}[keyof T]

type PartialBook = {
    [K in keyof IBook]?: IBook[K];
  };

type ReadonlyBook = {
    readonly [K in keyof IBook]: IBook[K];
  };

type ApiResponse<T> = {
    data: T,
    success: boolean,
    message: string,
    timestamp: Date
}


type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type ApiEndpoint = '/books' | '/authors' | '/libraries'

type LibraryEndpoints = `/libraries/${number}` | `/libraries/${number}/books` | `/libraries/${number}/authors`

type BookFieldType<K extends keyof IBook> = K extends keyof IBook ? IBook[K] : never


type ExtractApiData<T> = T extends ApiResponse<infer R> ? R : never
type ExtractPromiseType<T> = T extends Promise<infer U> ? U : never;
type ExtractArrayType<T> = T extends (infer R)[] ? R : never;


type LibraryBooksType = ExtractArrayType<ILibrary['books']>
type AuthorBooksType = ExtractArrayType<IAuthor["books"]>;


function getBookField<T extends keyof IBook>(book: IBook, field: T): IBook[T] {
    return book[field]
}

function updateBook(book: IBook, updates: Partial<IBook>): IBook {
    return { ...book, ...updates }
}

function createApiResponse<T>(
    data: T, 
    success: boolean = true, 
    message: string = "Success"
  ): ApiResponse<T> {
    return { 
      data, 
      success, 
      message, 
      timestamp: new Date()
    };
  }
  
  // 27. Создайте функцию для фильтрации книг по типу поля
  function filterBooksByField<T extends keyof IBook>(
    books: IBook[], 
    field: T, 
    value: IBook[T]
  ): IBook[] {
    return books.filter(book => book[field] === value);
  }
  const testBook: IBook = {
    id: 1,
    title: "1984",
    author: "George Orwell",
    year: 1949,
    genre: "fiction",
    pages: 328,
    isAvailable: true
  };
  

  const testLibrary: ILibrary = {
    id: 1,
    name: "Central Library",
    address: "123 Main St",
    books: [testBook],
    authors: []
  };
  
  // 29. Протестируйте все функции
  const bookTitle = getBookField(testBook, "title");
  const updatedBook = updateBook(testBook, { year: 1950 });
  const apiResponse = createApiResponse(testBook);
  const fictionBooks = filterBooksByField([testBook], "genre", "fiction");
  
  console.log(bookTitle);      // "1984"
  console.log(updatedBook);    // { ...testBook, year: 1950 }
  console.log(apiResponse);    // { data: testBook, success: true, ... }
  console.log(fictionBooks);   // [testBook]