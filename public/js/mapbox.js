const locations = JSON.parse(document.getElementById("map").dataset.locations);
console.log(locations)


mapboxgl.accessToken = 
'pk.eyJ1IjoibGVuZGFyaW8xNTciLCJhIjoiY20zdzhidjM0MTRvaTJrb21idm9pMndkdiJ9.RbstIyLluaAIZvoo_iTBnQ';

    const map = new mapboxgl.Map({
	container: 'map', // container ID
    style: 'mapbox://styles/lendario157/cm3wde0fg004501s0blzjexcn'
	
});

