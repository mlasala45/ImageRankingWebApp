# Image Ranking Web App
My Capstone Project for my Bachelor's Degree at UNCC.

The project is a web app that runs as three containerized services:
* A frontend, which is a NGINX server serving static assets (built by Vite).
* A backend, which is a ASP.NET Core server.
* A PostgreSQL database service.

The function of the project is to allow users to organize large sets of images by repeatedly making single comparison choices. The general workflow:
* Define a named dataset, which is typically a folder full of image files.
* The application presents you with two randomly selected images from the dataset.
* You choose which image is "greater" or "better" by whatever metric you want. Choices are made using the left and right arrow keys, for fast operation.
* By repeatedly making choices, a "rank" for each image is obtained, with an attached certainty value. The desired number of choices for a high-quality ranking is ~8 times the size of the dataset.
* Choice history and rank predictions are accessible for review and download.

You can rank by whatever metric you like. The project is fairly abstract, and could be used for a variety of purposes, but the key uses are Surveying, and ML Dataset Labeling.

## Motivation and Technologies Used
I've toyed with the idea of a ranking program for a few years, but the main purpose of the Capstone project was to gain exposure and experience in a wide range of technologies. The project's development stack includes:
* React
* ASP.NET
* Docker
* Microsoft Azure
* Kubernetes
* PostgreSQL

Other tools and frameworks involved:
* Visual Studio
* Git
* Vite
* MUI

## Project Status
The project's core features were completed, but I'm not actively working on it now that its purpose is fulfilled. This means that a couple of the more recent non-core features are not vetted for deployment, and only work in development builds.
The UI also is fairly unpolished, as I was prioritizing feature development over beautification.

## Using the project
**For development:**

You will need installations of Docker and Visual Studio.

* From `./reactapp`, run `npm run dev` to start the frontend Vite server.
* The backend ('webapi') can be built and run from Visual Studio, or by calling `dotnet run` in `./webapi`.
* The database service can be started with `docker compose up --build db`.

  The database administrative password can be set in `./compose.yaml`. Backend login details are hardcoded in `./webapi/AppDatabaseContext.cs`, and will need to be set up using a database manager such as pgAdmin.
  Once logins are set up, Visual Studio's CLI can populate the database with migrations, using `Update-Database`.

**For "deployment":**

* Bake the frontend into static assets using `npm run build` from `./reactapp`.
* All three services can be started concurrently using `docker compose up --build`.
* The database must have been set up as described above.
* The containers will still be running locally, and the frontend can be accessed through `http://localhost:80`. Further configuration would be needed to publish the frontend and backend services to the internet.

## About Azure and Kubernetes
The project was originally envisioned to be deployed on Azure Kubernetes Service (AKS). A full investigation and test of that deployment method was performed, and worked. However, scalable deployment is _extremely_ unnecessary for this project, and the point of doing this was to gain experience working with Azure and Kubernetes. Due to its containerized design, it could easily be deployed using Kubernetes if desired.

## Pictures
![Screenshot 2024-05-28 150222](https://github.com/mlasala45/ImageRankingWebApp/assets/118553159/3988a027-e40a-443b-9d1c-2118a26d6057)
![Screenshot 2024-05-28 150251](https://github.com/mlasala45/ImageRankingWebApp/assets/118553159/8851b63a-733d-4306-a7c9-53fe1638f380)
![Screenshot 2024-05-28 150353](https://github.com/mlasala45/ImageRankingWebApp/assets/118553159/6f9b8fe6-334c-4a51-9e8a-19e4c2600668)
![Screenshot 2024-05-28 150337](https://github.com/mlasala45/ImageRankingWebApp/assets/118553159/3f60a020-e5c5-4efc-932e-a51c084011a2)
![Screenshot 2024-05-28 150353](https://github.com/mlasala45/ImageRankingWebApp/assets/118553159/7807aa46-30e4-4351-868c-1869e70c5c40)
