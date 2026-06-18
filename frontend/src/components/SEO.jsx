import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  image = "/images/hero-food.png",
  url,
  type = "website",
}) => {
  const siteTitle = "GrandTaste — Order Fresh, Eat Happy";
  const fullTitle = title ? `${title} | GrandTaste` : siteTitle;
  const defaultDesc =
    "Hot & fresh food delivered to your doorstep in 30 minutes. Order burgers, pizza, chicken and more!";
  const metaDesc = description || defaultDesc;
  const metaUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta
        name="keywords"
        content="fast food, burger, pizza, chicken, delivery, Bangladesh, Dhaka, order food online"
      />
      <meta name="author" content="GrandTaste" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={metaUrl} />

      {/* Open Graph (Facebook, WhatsApp) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content="GrandTaste" />
      <meta property="og:locale" content="en_BD" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={image} />

      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#F97316" />
    </Helmet>
  );
};

export default SEO;
