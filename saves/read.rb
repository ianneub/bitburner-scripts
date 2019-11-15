require 'base64'
require 'json'
require 'yaml'

raw = Base64.decode64(File.read('bitburnerSave.json'))
data = JSON.parse(raw)
data['data'].keys.each do |key|
	new_data = JSON.parse(data['data'][key]) rescue ''
	data['data'][key] = new_data
end

File.open('bitburnerSave.yml', 'w') do |f|; f.write data.to_yaml; end
