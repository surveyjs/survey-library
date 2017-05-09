module Jekyll

  class ApiObjDocPage < Page
    def initialize(site, base, dir, name, data)
      @site = site
      @base = base
      @dir = dir
      @name = name
      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'api_object_template.html')
      self.data['title'] = data['name']
      self.data['classname'] = data['name']
    end
  end

  class ApiObjDocPageGenerator < Generator
    safe true
    def generate(site)
      datas = site.data['classes']
      datas.each do |data|
          dir = site.config['docs_dir'] || 'docs'
          name = "api_" + "#{data['name']}.html".downcase
          page = Jekyll::ApiObjDocPage.new(site, site.source, dir, name, data)
          site.pages << page        
      end
    end
  end

end