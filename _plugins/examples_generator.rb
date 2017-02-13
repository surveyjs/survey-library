module Jekyll

  class ExamplePage < Page
    def initialize(site, base, dir, platform, example)
      @site = site
      @base = base
      @dir = dir
      @name = example['name'] + '.html'

      self.process(@name)
      self.read_yaml(File.join(base, '_layouts'), 'example_template.html')

      use_platform_key = "use#{platform}"
      self.data[use_platform_key] = true

      self.data['includes'] = example['includes'] || ["examplesetups/standard.md", "live-example-code.html"]

      self.data['hasColumnCount'] = example['hasColumnCount']
      self.data['propertiesFile'] = example['propertiesFile']

      self.data['dataFile'] = "surveys/#{example['name']}.json"
      self.data['title'] = example['title']
    end
  end

  class CategoryPageGenerator < Generator
    safe true

    def generate(site)
      # if site.layouts.key? 'category_index'
        dir = site.config['examples_dir'] || 'examples'
        site.data['platforms'].each do |platform|
          name = platform['name']
          site.data['examples_'].each do |exampleDescription|
            site.pages << ExamplePage.new(site, site.source, File.join(dir, name), name, exampleDescription)
          end
        end
      # end
    end
  end

end