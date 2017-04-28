module Jekyll

  class ApiDocPage < Page
    def initialize(site, base, dir, name, data)
      @site = site
      @base = base
      @dir = dir
      @name = name
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'api_pme_template.html')
      self.data['title'] = data['name']
      self.data['pmename'] = data['name']
    end
  end

  class ApiDocPageGenerator < Generator
    safe true
    def generate(site)
      datas = site.data['apidescription']
      datas.each do |data|
        values = data['name'].split('.')
        dir = site.config['docs_dir'] || 'docs'
        objName = values[0]
        name = "#{values[1]}.html"
        page = Jekyll::ApiDocPage.new(site, site.source, File.join(dir, objName), name, data)
        site.pages << page        
      end
    end
  end

end