# CourtApp

## Overview
This repository is a mono repo setup using Yarn workspaces that supports both React Native and React JS projects. It includes common configurations and shared code to streamline development and ensure consistency across the app and web platforms.

## Table of Contents
- [Mono Repo Initialization](#mono-repo-initialization)
  - [Install Dependencies](#install-dependencies)
  - [Lint and Prettier](#lint-and-prettier)
  - [Build Shared Packages](#build-shared-packages)
  - [Run Mobile App](#run-mobile-app)
- [Mobile App](#mobile-app)
  - [API Calls](#api-calls)
  - [Theme Usage](#theme-usage)
- [Web](#web)
  - [API Calls](#api-calls)
- [Shared Items](#shared-items)
  - [Constants - Colors](#constants---colors)
- [ESLint and Prettier Configurations](#eslint-and-prettier-configurations)

## Mono Repo Initialization
The mono repo structure leverages Yarn workspaces to manage dependencies and shared code. This approach allows for a single repository to contain multiple projects (app and web) with shared business logic and configurations.

### Install Dependencies
Since this is a Yarn workspace, you should run `yarn install` at the root level to install all the dependencies for the projects:

```bash
yarn install

```

### Lint and Prettier

The package.json file in the root directory contains several scripts that you can run with `yarn run <script-name>`.

`lint`: Runs the linter (ESLint).
`format`: Runs the code formatter (Prettier).

### Build Shared Packages

Shared folder is located inside the packages directory. To navigate to a shared folder, use:

``` bash
cd packages/shared
```

If any changes happened inside shared logic. Then we should rebuild shared packages using below script.

``` bash
yarn build
```

### Run Mobile App
   
Project package.json contain following scripts for run and build mobile app

`start-metro`: "cd packages/mobile && yarn start" (Start the metro builder)
`android`: "cd packages/mobile && yarn android" (Run android emulator)
`ios`: "cd packages/mobile && yarn ios" (Run iOS simulator)
`build-android`: "cd packages/mobile && yarn build-android" (Build android release build)

For example, to start android

``` bash
yarn run start-metro
yarn run android
```

Another option is given below,

Mobile project is located inside the packages directory. To navigate to a specific project, use:

``` bash
cd packages/mobile
```

The package.json file in the mobile directory contains scripts for run mobile app.

`start`: Start the metro builder.
`android`: Start android.
`ios`: Start ios.

For example, to start a project:
``` bash
yarn run start
yarn run android
yarn run ios
```


## Mobile App
   Mobile app is cross platform app created using react native cli.

### API Calls
This project contains the setup for the API client using Axios. It includes the configuration for the base URL, headers, and interceptors. The base URL is read from the environment using the react-native-dotenv package.
The `apiRequest` function is defined here and is used to make API requests. Usage of the `apiRequest` function is shown below:

```js
  import { apiRequest } from '@api/index';

   ...

    const options = {
      method: 'POST',
      endpoint: '/login',
      data: {email, password}
    };
    
    const response = await apiRequest(options);

    if(response.data){
      // success logic
    } else {
      // error handling
    }
```

Additionally, there is a `useApi` hook available for API requests. The hook manages loading, response, and error states. Usage is shown below:

```js
  import useApi from '@api/useApi';

  ...

  const {loading, data, error, callApi} = useApi();

   useEffect(()=> {
      const options = {
         method: 'POST',
         endpoint: '/login',
         data: {email, password},
      };

      callApi(options);
   },[]);

  console.log('Data from useApi hook', data, loading, error)
```




### Theme Usage

The project implements a theme system using themeSlice built with the Redux Toolkit library.

The themeSlice:
This is a slice of the Redux store that manages the theme-related state. The reducers property defines the actions that can be dispatched to modify the theme state. In this case, there is a single reducer function called setThemeData. The setThemeData reducer takes two parameters: state (representing the current state) and action (representing the dispatched action).
When setThemeData is called, it updates the selectedTheme property of the state with the value from action.payload.
It also updates the colors property by accessing the colors object using action.payload as the key.
usage of theme

```js
  import {useSelector, useDispatch} from 'react-redux';

  import { setThemeData } from '@utils/themeSlice';

  ...

  const {colors} = useSelector((state: RootState) => state.theme);
  const dispatch = useDispatch();

  const themeStyle = {
    container: {
      backgroundColor: colors?.PRIMARY_BACKGROUND
    },
  };

  const changeTheme = () => {
     dispatch(setThemeData(Theme.Dark));
  }

  return (
    <View style={[styles.container, themeStyle.container]}>
      <Text style={[styles.text, themeStyle.text]}>Home</Text>
    </View>
  );

```


## Web
### Api Calls

## Shared Items
   Script for build latest shared package is given below

   ``` bash
   yarn build-shared
   ```
   Package.json contain following script 
   `build-shared`: "cd packages/shared && yarn build"

### Constants - Colors
- Shared color constants for consistent theming across the app and web.
