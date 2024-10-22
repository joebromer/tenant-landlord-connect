
const API_URL = 'http://localhost:3001';



// Fetch properties from the API
async function fetchProperties() {
  try {
    const response = await fetch(`${API_URL}/properties`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
}

// Fetch landlord details
async function fetchLandlord(id) {
  try {
    const response = await fetch(`${API_URL}/landlords/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching landlord:', error);
    return null;
  }
}

// Display properties
function displayProperties(properties) {
  const propertyList = document.getElementById('property-list');
  propertyList.innerHTML = '';

  properties.forEach(property => {
    const template = document.getElementById('property-template');
    const propertyElement = template.content.cloneNode(true);

    propertyElement.querySelector('.property-image').src = property.image;
    propertyElement.querySelector('.property-image').alt = `Image of ${property.address}`;
    propertyElement.querySelector('.property-address').textContent = property.address;
    propertyElement.querySelector('.property-type').textContent = property.type;
    propertyElement.querySelector('.property-details').textContent = `${property.bedrooms} bed, ${property.bathrooms} bath`;
    propertyElement.querySelector('.property-price').textContent = `KSH ${property.rentPrice}/month`;
    propertyElement.querySelector('.property-vacancy').textContent = property.isVacant ? 'Vacant' : 'Occupied';

    const contactButton = propertyElement.querySelector('.contact-landlord');
    contactButton.addEventListener('click', () => contactLandlord(property.landlordId));

    propertyList.appendChild(propertyElement);
  });
}

// Filter properties
function filterProperties(properties) {
  const minPrice = document.getElementById('min-price').value;
  const maxPrice = document.getElementById('max-price').value;
  const propertyType = document.getElementById('property-type').value;
  const vacancy = document.getElementById('vacancy').value;

  return properties.filter(property => {
    if (minPrice && property.rentPrice < minPrice) return false;
    if (maxPrice && property.rentPrice > maxPrice) return false;
    if (propertyType && property.type !== propertyType) return false;
    if (vacancy && property.isVacant.toString() !== vacancy) return false;
    return true;
  });
}

// Contact landlord
async function contactLandlord(landlordId) {
  const landlord = await fetchLandlord(landlordId);
  if (landlord) {
    alert(`Contact ${landlord.name} at ${landlord.email} or ${landlord.phone}`);
  } else {
    alert('Unable to fetch landlord information. Please try again later.');
  }
}

// Initialize the application
async function init() {
  const properties = await fetchProperties();
  displayProperties(properties);

  const filterForm = document.getElementById('filter-form');
  filterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const filteredProperties = filterProperties(properties);
    displayProperties(filteredProperties);
  });
}

// Call init when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);