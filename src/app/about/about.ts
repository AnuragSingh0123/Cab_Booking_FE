import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
  heroImage =
    'https://images.unsplash.com/photo-1556122071-e404eaedb77f?q=80&w=1600&auto=format&fit=crop';

  aboutImage =
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop';

  heroTitle = 'About Our Cab Service';

  heroDescription =
    'Fast, reliable, and affordable rides designed to make your daily travel smooth and stress-free.';

  cabTypes = [
    {
      title: 'Mini',
      image:
        'https://images.unsplash.com/photo-1646119253693-0b80f2906791?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0',
      description: 'Affordable and compact rides perfect for daily city travel.',
    },
    {
      title: 'Sedan',
      image:
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop',
      description: 'Comfortable rides ideal for family trips and business travel.',
    },
    {
      title: 'SUV',
      image:
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop',
      description: 'Spacious rides for group travel with extra comfort and luggage space.',
    },
    {
      title: 'Premium',
      image:
        'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=1200&auto=format&fit=crop',
      description: 'Luxury rides with premium comfort for special and executive travel.',
    },
  ];
}
