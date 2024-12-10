export const load = ({ url }) => {
    return {
      displayName: url.searchParams.get('displayName')
    };
  };