from liquipediapy import dota
import json
import requests
import time

class Player:
  def __init__(self, name, country, team):
    self.name = name
    self.country = country
    self.team = team
  def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, 
            sort_keys=True, indent=4)

dota_obj = dota("appname")

players = dota_obj.get_players()
playerFormat = {}
print(players);
teamsL = set()
teamsO = set()

for player in players:
    teamsL.add(player['Team'][1:])
    playerFormat[player["ID"]] = Player(player["ID"], player["country"], player['Team'][1:])

print(teamsL)

r = requests.get("https://api.opendota.com/api/teams")
teams = json.loads(r.content)
for team in teams:
	teamsO.add(team["name"])
	print(team["name"])

lst3 = teamsL & teamsO
print(lst3) 

team_ids = {}
for team in teams:
	if team["name"] in lst3:
		team_ids[team["team_id"]] = team["name"];

print(team_ids)

teamRoster ={}
playerRoster = {}

for team_id in team_ids.keys():
	r = requests.get("https://api.opendota.com/api/teams/" + str(team_id) + "/players")
	
	time.sleep( 2 )
	pros = json.loads(r.content)
	if len(pros) > 0 and "error" not in pros[0]:
		playerRoster = {}
		print(team_id)
		for pro in pros:
			if pro["is_current_team_member"]:
				if pro["is_current_team_member"] == True:
					if pro["name"] in playerFormat:
						playerRoster[pro["account_id"]] = json.loads(playerFormat[pro["name"]].toJSON())
					else :
						playerRoster[pro["account_id"]] = json.loads(Player(pro["name"], "", team_ids[team_id]).toJSON())
	print(playerRoster);
	teamRoster[team_id] = playerRoster;
print(teamRoster);

with open('players.json', 'w') as outfile:
    json.dump(teamRoster, outfile)