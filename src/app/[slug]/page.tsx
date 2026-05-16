import Link from 'next/link';
import { Layout } from '../../components';

interface Props {
  params: Promise<{ slug: string }>;
}

const pageContent: Record<
  string,
  {
    title: string;
    eyebrow: string;
    description: string;
    sections: Array<{ title: string; body: string }>;
    ctaLabel?: string;
    ctaHref?: string;
  }
> = {
  blog: {
    title: 'Store Blog',
    eyebrow: 'Updates',
    description: 'Read buying guides, product highlights, and store updates from UDT Store.',
    sections: [
      {
        title: 'Latest buying guides',
        body: 'Our team shares practical advice for choosing laptops, smartphones, audio gear, accessories, and everyday tech essentials.',
      },
      {
        title: 'Product announcements',
        body: 'New arrivals and limited-time deals are highlighted here before they rotate into the home page promotions.',
      },
    ],
    ctaLabel: 'Shop Products',
    ctaHref: '/shop',
  },
  careers: {
    title: 'Careers',
    eyebrow: 'Join UDT Store',
    description:
      'Help us build a friendly, reliable online shopping experience for modern tech buyers.',
    sections: [
      {
        title: 'Open roles',
        body: 'We are collecting interest for support, operations, merchandising, and engineering roles.',
      },
      {
        title: 'How to apply',
        body: 'Send your profile through the contact page and include the role area you are interested in.',
      },
    ],
    ctaLabel: 'Contact Us',
    ctaHref: '/contact',
  },
  faq: {
    title: 'FAQ',
    eyebrow: 'Help Center',
    description: 'Quick answers for common shopping, delivery, payment, and account questions.',
    sections: [
      {
        title: 'How do I place an order?',
        body: 'Browse products, add items to your cart, proceed to checkout, fill in billing details, choose a payment option, accept the terms, and place the order.',
      },
      {
        title: 'Can I save products for later?',
        body: 'Yes. Use the heart icon on product cards or product detail pages to save products to your wishlist.',
      },
    ],
    ctaLabel: 'Start Shopping',
    ctaHref: '/shop',
  },
  shipping: {
    title: 'Shipping Info',
    eyebrow: 'Delivery',
    description: 'Understand how UDT Store estimates shipping and delivery for checkout.',
    sections: [
      {
        title: 'Shipping estimate',
        body: 'The demo checkout uses a flat shipping estimate. A production store can replace this with carrier or location-based rates.',
      },
      {
        title: 'Delivery updates',
        body: 'Order tracking details can be checked from the Track Order page once a real order system is connected.',
      },
    ],
    ctaLabel: 'Track Order',
    ctaHref: '/track-order',
  },
  returns: {
    title: 'Returns & Exchanges',
    eyebrow: 'Customer Service',
    description: 'Review the return and exchange policy before buying.',
    sections: [
      {
        title: 'Return window',
        body: 'Items can be marked for a 30-day return policy in the storefront. A real store should connect this to order history and support workflows.',
      },
      {
        title: 'Exchange support',
        body: 'Contact support with your order number, billing email, and the product you want to exchange.',
      },
    ],
    ctaLabel: 'Contact Support',
    ctaHref: '/support',
  },
  'size-guide': {
    title: 'Size Guide',
    eyebrow: 'Product Help',
    description: 'Find compatibility notes for accessories and product sizing.',
    sections: [
      {
        title: 'Tech compatibility',
        body: 'Check product details and specifications before buying chargers, cases, storage devices, and accessories.',
      },
      {
        title: 'Need advice?',
        body: 'Use the contact form for product fit or compatibility questions.',
      },
    ],
    ctaLabel: 'Ask a Question',
    ctaHref: '/contact',
  },
  'track-order': {
    title: 'Track Your Order',
    eyebrow: 'Orders',
    description: 'Use your account dashboard to enter an order ID and billing email.',
    sections: [
      {
        title: 'Order lookup',
        body: 'The current order tracking form is available inside the account page after signing in to the demo dashboard.',
      },
      {
        title: 'What you need',
        body: 'Keep your order ID and checkout email ready. A production integration can validate these against real order records.',
      },
    ],
    ctaLabel: 'Open Account',
    ctaHref: '/account',
  },
  support: {
    title: 'Support',
    eyebrow: 'Help',
    description: 'Get help with orders, products, returns, and account questions.',
    sections: [
      {
        title: 'Contact options',
        body: 'Use the contact form, email support, or call the customer service number shown in the header.',
      },
      {
        title: 'Before contacting us',
        body: 'Include product names, order details, screenshots, and the email address used at checkout when possible.',
      },
    ],
    ctaLabel: 'Contact Us',
    ctaHref: '/contact',
  },
  privacy: {
    title: 'Privacy Policy',
    eyebrow: 'Legal',
    description:
      'Learn how customer and browsing data should be handled in a production storefront.',
    sections: [
      {
        title: 'Current data storage',
        body: 'This demo stores cart and wishlist data in your browser localStorage. No backend profile or payment data is collected.',
      },
      {
        title: 'Production note',
        body: 'Before launch, replace this page with a policy reviewed for your region, data processors, analytics, payments, and support tools.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    eyebrow: 'Legal',
    description: 'Review the shopping terms for UDT Store.',
    sections: [
      {
        title: 'Demo checkout',
        body: 'The checkout form is a functional front-end flow and does not charge cards or create real orders.',
      },
      {
        title: 'Production note',
        body: 'Before launch, replace this page with legal terms covering payments, delivery, returns, warranties, and customer responsibilities.',
      },
    ],
  },
  login: {
    title: 'Login',
    eyebrow: 'Account',
    description: 'Sign in through the account page to access the demo dashboard.',
    sections: [
      {
        title: 'Demo sign in',
        body: 'The account form accepts any valid-looking email and password, then opens the local dashboard without calling a backend.',
      },
    ],
    ctaLabel: 'Go to Account',
    ctaHref: '/account',
  },
  register: {
    title: 'Create Account',
    eyebrow: 'Account',
    description: 'Account registration is ready to connect to a real authentication provider.',
    sections: [
      {
        title: 'Current flow',
        body: 'Use the account page to enter the demo dashboard. Production registration can be added with an auth provider or custom API.',
      },
    ],
    ctaLabel: 'Open Account',
    ctaHref: '/account',
  },
  'forgot-password': {
    title: 'Forgot Password',
    eyebrow: 'Account',
    description: 'Password recovery is a placeholder until real authentication is connected.',
    sections: [
      {
        title: 'Recovery flow',
        body: 'A production site should send password reset links through the selected authentication provider.',
      },
    ],
    ctaLabel: 'Back to Login',
    ctaHref: '/account',
  },
};

export async function generateStaticParams() {
  return Object.keys(pageContent).map((slug) => ({ slug }));
}

async function InfoPage({ params }: Props) {
  const { slug } = await params;
  const content = pageContent[slug] || pageContent.support;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="text-sm">
              <Link href="/" className="text-gray-500 hover:text-primary">
                Home
              </Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-900">{content.title}</span>
            </nav>
          </div>
        </div>

        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-16">
            <p className="text-sm font-semibold uppercase text-primary mb-3">{content.eyebrow}</p>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
            <p className="text-lg text-gray-600 max-w-3xl">{content.description}</p>
            {content.ctaHref && content.ctaLabel && (
              <Link
                href={content.ctaHref}
                className="inline-block mt-8 bg-primary text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
              >
                {content.ctaLabel}
              </Link>
            )}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.sections.map((section) => (
              <article key={section.title} className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{section.title}</h2>
                <p className="text-gray-600 leading-relaxed">{section.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default InfoPage;
