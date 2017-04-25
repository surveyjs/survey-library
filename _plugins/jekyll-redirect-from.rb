require "jekyll"
require "jekyll-redirect-from/version"
require "jekyll-redirect-from/generator"

module JekyllRedirectFrom
  # Jekyll classes which should be redirectable
  CLASSES = [Jekyll::Page, Jekyll::Document, Jekyll::ExamplePage, Jekyll::DocPage].freeze

  autoload :Context,      "jekyll-redirect-from/context"
  autoload :RedirectPage, "jekyll-redirect-from/redirect_page"
  autoload :Redirectable, "jekyll-redirect-from/redirectable"
  autoload :Layout,       "jekyll-redirect-from/layout"
end

JekyllRedirectFrom::CLASSES.each do |klass|
  klass.send :include, JekyllRedirectFrom::Redirectable
end
