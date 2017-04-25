module Jekyll

  class DocPage < Page
    def initialize(site, base, dir, platform, docPage)
      @site = site
      @base = base
      @dir = dir
      @name = docPage['name'] + '.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'doc_page.html')

      use_platform_key = "use#{platform}"
      self.data[use_platform_key] = true

      self.data['includes'] = docPage['includes'] || ['docsetups/' + docPage['name'] + '.md']
      self.data['canonicalUrl'] = docPage['canonicalUrl']
      #self.data['dataFile'] = docPage['dataFile'] || "surveys/#{docPage['name']}.json"
      self.data['title'] = docPage['title']
      self.data['doc_name'] = docPage['name']
      self.data['doc_category'] = docPage['category']

      if 'jquery'.eql? platform #TODO: avoid this somehow...
        self.data['redirect_from'] = "/docs/#{docPage['name']}.html"
      end
    end
  end

  class DocPagesGenerator < Generator
    safe true

    def generate(site)
      dir = site.config['doc_dir'] || 'docs'
      site.data['platforms'].each do |platform|
        platformName = platform['name']
        site.data['docs']['pages'].each do |docPageDescription|
          site.pages << DocPage.new(site, site.source, File.join(dir, platformName), platformName, docPageDescription)
        end
      end
    end
  end

end
