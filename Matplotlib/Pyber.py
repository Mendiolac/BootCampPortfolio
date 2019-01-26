
# coding: utf-8

# In[3]:


get_ipython().run_line_magic('matplotlib', 'inline')
# Dependencies and Setup
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# File to Load (Remember to change these)
city_data_to_load = "data/city_data.csv"
ride_data_to_load = "data/ride_data.csv"

city_data=pd.read_csv(city_data_to_load)
ride_data=pd.read_csv(ride_data_to_load)

merge_table=pd.merge(ride_data, city_data, on="city", how="left")
merge_table.head()


# ## Bubble Plot of Ride Sharing Data

# In[2]:


# Obtain the x and y coordinates for each of the three city types
rural= merge_table[merge_table["type"]=="Rural"]
urban=merge_table[merge_table["type"]=="Urban"]
suburban=merge_table[merge_table["type"]=="Suburban"]

# Build the scatter plots for each city types
rural_ride_count= rural.groupby(["city"]).count()["ride_id"]
rural_average_fare= rural.groupby(["city"]).mean()["fare"]
rural_driver_count= rural.groupby(["city"]).mean()["driver_count"]

urban_ride_count= urban.groupby(["city"]).count()["ride_id"]
urban_average_fare= urban.groupby(["city"]).mean()["fare"]
urban_driver_count= urban.groupby(["city"]).mean()["driver_count"]

suburban_ride_count= suburban.groupby(["city"]).count()["ride_id"]
suburban_average_fare= suburban.groupby(["city"]).mean()["fare"]
suburban_driver_count= suburban.groupby(["city"]).mean()["driver_count"]

# Incorporate the other graph properties
plt.scatter(rural_ride_count, rural_average_fare, marker="o", s=10*rural_driver_count, label="Rural", facecolors="blue", alpha=.4, edgecolors="black")
plt.scatter(suburban_ride_count, suburban_average_fare, marker="o", s=10*suburban_driver_count, label="Surburban", facecolors="green", alpha=.4, edgecolors="black")
plt.scatter(urban_ride_count, urban_average_fare, marker="o", s=10*urban_driver_count, label="Urban", facecolors="magenta", alpha=.4, edgecolors="black")

# Create a legend
plt.legend(loc="upper right",fontsize=10, )

# Incorporate a text label regarding circle size
plt.title("Pyber Ride Sharing Data(2016)")
plt.xlabel("Total Number of Rides(Per City)")
plt.ylabel("Average Fare($)")
plt.grid()
plt.text(1.5, 3.5, "Note: Circle sizes correlate with driver count per city", fontsize=12)

# Save Figure
plt.savefig("/Images/fig1.png")


# ## Total Fares by City Type

# In[3]:


# Calculate Type Percents
percentages= 100*merge_table.groupby(['type']).sum()["fare"]/merge_table["fare"].sum()
percentages

# Build Pie Chart
labels=["Rural", "Urban", "Suburban"]
explode=(0,0, 0.1)
colors=["lightcoral", "lightskyblue","cyan"]   
plt.title("% of Total Fares by City Type")                            
plt.pie(percentages, labels=labels, colors=colors, autopct="%1.2f%%", explode=explode, shadow=True, startangle=140)   

# Save Figure
plt.savefig("/Images/fig2.png")


# ## Total Rides by City Type

# In[5]:


# Calculate Ride Percents
rides= 100*merge_table.groupby(['type']).sum()["ride_id"]/merge_table["ride_id"].sum()
rides

# Build Pie Chart
labels=["Rural", "Urban", "Suburban"]
explode=(0,0, 0.1)
colors=["lightcoral", "lightskyblue","cyan"]   
plt.title("% of Total Rides by City Type")  
plt.pie(rides, labels=labels, colors=colors, autopct="%1.2f%%", explode=explode, shadow=True, startangle=140) 

# Save Figure
plt.savefig("/Images/fig3.png")


# ## Total Drivers by City Type

# In[6]:


# Calculate Driver Percents
drivers= 100*merge_table.groupby(['type']).sum()["driver_count"]/merge_table["driver_count"].sum()
drivers

# Build Pie Charts
labels=["Rural", "Urban", "Suburban"]
explode=(0,0, 0.1)
colors=["lightcoral", "magenta","cyan"]   
plt.title("% of Total Drivers by City Type") 
plt.pie(drivers, labels=labels, colors=colors, autopct="%1.2f%%", explode=explode, shadow=True, startangle=140) 

# Save Figure
plt.savefig("/Images/fig4.png")

