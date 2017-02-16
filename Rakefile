require "jekyll"

namespace :site do
  desc "Publish site to gh-pages"
  task :publish do
    Jekyll::Site.new(Jekyll.configuration({
      "source"      => ".",
      "destination" => "_site",
      "config" => "_config.yml"
    })).process

    origin = `git config --get remote.origin.url`
    Dir.chdir "_site/."

    system "git init"
    system "git add . && git commit -m \"Site updated at #{Time.now.utc}\""
    system "git remote add origin #{origin}"
    system "git push origin master:refs/heads/gh-pages --force"
  end
end