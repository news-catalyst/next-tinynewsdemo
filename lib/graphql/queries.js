const CREATE_LAYOUT = `mutation CreateHomepageLayoutData($data: HomepageLayoutDataInput!) {
  homepageLayoutDatas {
      createHomepageLayoutData(data: $data) {
        data {
          id
          data
          layoutSchema {
            id
            name
            data
          }
        }
        error  {
          code
          message
          data
        }
      }
  }
}`;

const CREATE_LAYOUT_SCHEMA = `mutation CreateHomepageLayoutSchema($data: HomepageLayoutSchemaInput!) {
  homepageLayoutSchemas {
      createHomepageLayoutSchema(data: $data) {
        data {
          id
          name
          data
        }
        error  {
          code
          message
          data
        }
      }
  }
}`;

const UPDATE_LAYOUT = `mutation UpdateHomepageLayoutSchema($id: ID!, $data: HomepageLayoutSchemaInput!) {
  homepageLayoutSchemas {
    updateHomepageLayoutSchema(id: $id, data: $data) {
      data {
        id
        name
        data
      }
      error {
        code
        data
        message
      }
    }
  }
}`;

const LIST_HOMEPAGE_DATA = `{
  homepageLayoutDatas {
    listHomepageLayoutDatas {
      error{
        code
        message
      }
      data {
        id
        data
        layoutSchema {
          id
          name
          data
        }
      }
    }
  }
}`;

const LIST_LAYOUT_SCHEMAS = `{
  homepageLayoutSchemas {
    listHomepageLayoutSchemas {
      error {
        code
        message
      }
      data {
        id
        name
        data
      }
    }
  }
}`;

const GET_LAYOUT = `query GetHomepageLayoutSchema($id: ID!) {
  homepageLayoutSchemas {
    getHomepageLayoutSchema(id: $id) {
      data {
        id
        name
        data
      }
      error {
        code
        data
        message
      }
    }
  }
}`;

module.exports = {
  CREATE_LAYOUT,
  CREATE_LAYOUT_SCHEMA,
  UPDATE_LAYOUT,
  LIST_HOMEPAGE_DATA,
  LIST_LAYOUT_SCHEMAS,
  GET_LAYOUT,
};
