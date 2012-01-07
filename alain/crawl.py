import json
from urllib2 import urlopen

HOST = '192.168.1.12'
PORT = 8123

a = [{"Name":"MealService","Url":"/mealservice"},{"Name":"WikipediaService","Url":"/wikipediaservice"},{"Name":"MasterService","Url":"/masterservice"},{"Name":"TastingService","Url":"/tastingservice"},{"Name":"SensoryService","Url":"/sensoryservice"},{"Name":"ImageService","Url":"/imageservice"},{"Name":"BlitzService","Url":"/blitzservice"},{"Name":"SellerService","Url":"/sellerservice"},{"Name":"BottleService","Url":"/bottleservice"},{"Name":"WineDenominationService","Url":"/winedenominationservice"}]

for i in a:
   url = i['Url']
   test = 'http://%s:%s%s/def' % (HOST, PORT, url)
   print test
   print urlopen(test).read()
