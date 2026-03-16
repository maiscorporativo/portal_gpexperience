export interface EventHighlight {
  title: string;
  location: string;
  date: string;
  img: string;
}

export interface TrendingPackage {
  tag: string;
  title: string;
  loc: string;
  date: string;
  price: string;
  img: string;
  badge: string;
  description?: string;
  flightDetails?: string;
  hotelDetails?: string;
  ticketDetails?: string;
}

export interface Testimonial {
  img: string;
  user: string;
  text: string;
}
