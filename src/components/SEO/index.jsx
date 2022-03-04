import React from "react"
import { Helmet } from "react-helmet"
import { siteUrl } from "../../../blog-config"

const SEO = ({ title, description, url }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={`${siteUrl}/og-image.png`} />
      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      <meta
        name="google-site-verification"
        content="CI8QQeFyFDFWoMOnDfLbOftCGVbKSKXBC4qymqp35F8"
      />
      <meta
        name="naver-site-verification"
        content="fe71bd8be94821af50e16778cff6bfe056a8b1d1"
      />
    </Helmet>
  )
}

export default SEO
