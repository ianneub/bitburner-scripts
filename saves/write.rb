require 'base64'
require 'json'
require 'yaml'

data = YAML.load(File.read('bitburnerSave.yml'))
data['data'].keys.each do |key|
	new_data = data['data'][key].to_json
	data['data'][key] = new_data
end

File.open('bitburnerSave_new.json', 'w') do |f|
	f.write Base64.encode64(data.to_json)
end
