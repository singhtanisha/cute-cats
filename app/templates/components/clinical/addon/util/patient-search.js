import { isEmpty } from '@ember/utils';
export default {
    formatNameParameters(searchText) {
        if (isEmpty(searchText)) {
            return {};
        }
        const name = searchText.trim();
        const commaIndex = name.indexOf(',');
        const spaceIndex = name.indexOf(' ');

        // The server doesn't support searching by first name (yet). So if there's a single word
        // we use firstOrLastName and it will search on both.
        // If we have a space or a comma we treat this as two separate searches
        // NOTE: This has a lot of problems with middle names, double last names, and lastNames that
        // can be used as firstNames (like Campbell)
        if (commaIndex !== -1) {
            return {
                lastName: name.substring(0, commaIndex).trim(),
                firstName: name.substring(commaIndex + 1).trim()
            };
        } else if (spaceIndex !== -1) {
            return {
                firstName: name.substring(0, spaceIndex).trim(),
                lastName: name.substring(spaceIndex + 1).trim()
            };
        }
        return {
            firstOrLastName: name
        };
    }
};
