module Jekyll

  class ApiDocPage < Page
    def initialize(site, base, dir, name, data)
      @site = site
      @base = base
      @dir = dir
      @name = name
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'api_pme_template.html')
      fullName = "#{data['className']}.#{data['name']}"
      self.data['title'] = fullName
      self.data['pmename'] = fullName
    end
  end

  class ApiDocPageGenerator < Generator
    safe true
    def generate(site)
#      datas = site.data['pmes']
#      datas.each do |data|
#        propName = data['name']
#        dir = site.config['docs_dir'] || 'docs'
#        objName = data['className']
#        name = "#{propName}.html"
#        page = Jekyll::ApiDocPage.new(site, site.source, File.join(dir, objName), name, data)
#        site.pages << page        
#      end
    end
  end

end