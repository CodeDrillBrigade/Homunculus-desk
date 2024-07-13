# Homunculus Desk

![Homunculus Icon](https://raw.githubusercontent.com/CodeDrillBrigade/Homunculus-desk/main/public/logo192.png)

Homunculus is a simple app to manage biochemistry lab inventories.<br>
It supports:

-   Multiple users with different permissions
-   Managing multiple rooms with multiple cabinets, with a shelf granularity.
-   Managing different types of materials with different configuration, allowing to specify the structure of each box.
-   Updating the current inventory, keeping a History of the usage of each material.

### Roadmap

-   [x] First bare, working version (0.2.0)
-   [ ] Improving roles and permissions
-   [x] Improving search
-   [x] Add alerts and reports
-   [ ] Manage Users
-   [ ] Manage current Users

## :warning: Running Homunculus

This is only the React-based frontend of Homunculus. To run the whole application, check the [full-fledged compose repo](https://github.com/CodeDrillBrigade/homunculus-compose).<br>
However, to run that, you will still need an docker image for this frontend. You can build it running the following commands:

```bash
git clone https://github.com/CodeDrillBrigade/Homunculus-desk.git
cd Homunculus-desk
echo "REACT_APP_APIURL=<YOUR_BACKEND_URL>" >> .env
docker build . -t homunculus-desk:latest
```

:warning: Don't forget to replace `<YOUR_BACKEND_URL>` with the actual URL of your Homunculus backend.
