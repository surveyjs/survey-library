{% if include.usereact %}
    {% include examplesetups/standard-setup.md usereact=true data='surveys/questiontype-text.json' %}
    
{% elsif include.useknockout%}
    {% include examplesetups/standard-setup.md useknockout=true data='surveys/questiontype-text.json' %}
    
{% elsif include.useangular%}
    {% include examplesetups/standard-setup.md useangular=true data='surveys/questiontype-text.json' %}
    
{% elsif include.usejquery%}
    {% include examplesetups/standard-setup.md usejquery=true data='surveys/questiontype-text.json' %}

{% endif %}

{% include live-example-code.html %}
