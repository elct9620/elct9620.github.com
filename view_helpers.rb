module ViewHelpers
  def config
    data ||= YAML.load_file(File.join(File.dirname(__FILE__), "config.yml"))
    data
  end

  def enable_analytics?
    config['analytics']['enabled']
  end

  def analytics_code
    config['analytics']['code']
  end
end
