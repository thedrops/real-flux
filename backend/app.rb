require 'sinatra'
require 'sinatra/json'

class MyApp < Sinatra::Base
  get '/' do
    json message: 'Olá, mundo!'
  end
end