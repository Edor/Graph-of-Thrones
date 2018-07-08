from xml.dom import minidom

mydoc = minidom.parse('data.xml')
nodi_non_filtrati = mydoc.childNodes[0].childNodes
nodi_filtrati = []
for nodo in nodi_non_filtrati:
    if nodo.localName == 'node':
        proprieta_nodo = []
        # for proprieta in nodo.childNodes:
        #     if nodo.localName == 'data':
        #         proprieta_nodo.append(proprieta)
        # nodo.childNodes = proprieta_nodo
        nodi_filtrati.append(nodo)
