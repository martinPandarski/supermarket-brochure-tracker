export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  store: string;
  category: string;
  image_url: string;
  validFrom: string;
  validTo: string;
  discount?: string;
  brochure:{
    code: string;
    id: number;
    valid_from: string;
    valid_until: string;
  }
  supermarket:{
    id: number;
    logo: string;
    name: string;
    slug: string;
  }

old_price_eur: number;
old_price_lev:number;
price_eur: number;
price_lev: number;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
}


export interface Category {
  name: string;
  products_count: number
}