import json

graph = json.load(open("graph.json"))

nodes = graph['graph']['node']
edges = graph['graph']['edge']
houses = {}
people = {}

for node in nodes:
    num = node['id']
    for data in node['data']:
        key = data['key']
        value = data['text']
        node[key] = value

        if key == 'house-birth' or key == 'house-marriage' or key == 'group':
            if value not in houses.keys():
                houses[value] = -1  # []
            if num not in people.keys():
                people[num] = {}
            # houses[value].append({'id': num, 'type': key})
            people[num][key] = value
    del node['data']

for casata in houses.keys():
    num = int(num)+1
    houses[casata] = num
    nodes.append({'id': str(num), 'name': casata})
print(str(houses))
print('--------------------------------')
print(str(people))

for edge in edges:
    if 'list' in str(type(edge['data'])):
        for data in edge['data']:
            key = data['key']
            value = data['text']
            edge[key] = value
    else:
        key = edge['data']['key']
        value = edge['data']['text']
        edge[key] = value
    del edge['data']

for edge in edges:
    if edge['relation'] == 'killed': # and edge[]
        edge['value'] = 40
        edge['stroke'] = '#c52507'
        edge['stroke-dasharray'] = '0'
    if edge['relation'] == 'mother' and edge['type'] == 'biological':
        edge['value'] = 4
        edge['stroke'] = '#839098'
        edge['stroke-dasharray'] = '0'
    if edge['relation'] == 'father' and edge['type'] == 'biological':
        edge['value'] = 4
        edge['stroke'] = '#839098'
        edge['stroke-dasharray'] = '0'
    if edge['relation'] == 'sibling' and edge['type'] == 'biological':
        edge['value'] = 8
        edge['stroke'] = '#839098'
        edge['stroke-dasharray'] = '5,5'
    if edge['relation'] == 'father' and edge['type'] == 'legal':
        edge['value'] = 8
        edge['stroke'] = '#839098'
        edge['stroke-dasharray'] = '20,10,5,5,5,10'
    if edge['relation'] == 'lover':
        edge['value'] = 16
        edge['stroke'] = '#913ccd'
        edge['stroke-dasharray'] = '10,10'
    if edge['relation'] == 'spouse':
        edge['value'] = 4
        edge['stroke'] = '#913ccd'
        edge['stroke-dasharray'] = '0'
    if edge['relation'] == 'allegiance' and edge['type'] == 'dragon':
        edge['value'] = 8
        edge['stroke'] = '#5481e6'
        edge['stroke-dasharray'] = '0'
    if edge['relation'] == 'allegiance' and edge['type'] == 'direwolf':
        edge['value'] = 8
        edge['stroke'] = '#5481e6'
        edge['stroke-dasharray'] = '0'
    if edge['relation'] == 'allegiance' and edge['type'] == 'pledge':
        edge['value'] = 24
        edge['stroke'] = '#98cb4a'
        edge['stroke-dasharray'] = '10,10'
    if edge['relation'] == 'allegiance' and edge['type'] == 'oath':
        edge['value'] = 16
        edge['stroke'] = '#98cb4a'
        edge['stroke-dasharray'] = '0'
    if edge['relation'] == 'allegiance' and edge['type'] == 'kingsguard':
        edge['value'] = 16
        edge['stroke'] = '#98cb4a'
        edge['stroke-dasharray'] = '0'
    if edge['relation'] == 'allegiance' and edge['type'] == 'queensquard':
        edge['value'] = 16
        edge['stroke'] = '#98cb4a'
        edge['stroke-dasharray'] = '0'
    if edge['relation'] == 'allegiance' and edge['type'] == 'hand':
        edge['value'] = 16
        edge['stroke'] = '#98cb4a'
        edge['stroke-dasharray'] = '0'
    if edge['relation'] == 'allegiance' and edge['type'] == 'ward':
        edge['value'] = 16
        edge['stroke'] = '#98cb4a'
        edge['stroke-dasharray'] = '0'
for person in people.keys():
    value = 1
    if 'group' in people[person].keys():
        edges.append({"source": person, "target": str(houses[people[person]['group']]), "type": 'group', "value": value, "stroke":'black', 'stroke-dasharray': '0'})
        value *= 2
    if 'house-marriage' in people[person].keys():
        edges.append({"source": person, "target": str(houses[people[person]['house-marriage']]), "type": 'house-marriage', "value": value,"stroke":'black', 'stroke-dasharray': '0'})
        value *= 4
    if 'house-birth' in people[person].keys():
        edges.append({"source": person, "target": str(houses[people[person]['house-birth']]), "type": 'house-birth', "value": value,"stroke":'black', 'stroke-dasharray': '0'})
        value *= 2

to_save = {'node': nodes, 'edge': edges}


with open('data2.json', 'w') as out_file:
    json.dump(to_save, out_file, indent=4)

