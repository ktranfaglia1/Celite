/*
* documentation.js
* Authors: Kyle Tranfaglia, Timmy McKirgan, Dustin O'Brien
* This file handles all functionality for the documentation page, including sidebar movement on scroll, sidebar expandable list, and back to top hover button
* Last Updated: 04/27/24
*/
$(document).ready(function() {
    // Toggle active class on main menu title and submenu
    $('.menu_title').click(function() {
      $(this).toggleClass('active');
      $(this).siblings('.submenu').toggleClass('active');
    });

    // Get sidebar element and the initial top padding of the sidebar
    let sidebar = $(".sidebar");
    let initialPadding = parseInt(sidebar.css("padding-top"));

    // Adjust top padding upon window scroll
    $(window).on("scroll", function() {
      let scrollPos = $(this).scrollTop();  // Get current scroll position

      // Calculate new padding based on scroll position and ensure padding is not negative
      let newPadding = initialPadding - scrollPos;
      newPadding = Math.max(newPadding, 0);

      sidebar.css("padding-top", newPadding + "px");  // Apply new padding to sidebar
    });
});

// Listen for and handle the scroll event
window.onscroll = function scrollFunction() {
    // Check if the scroll position is greater than 250 pixels from the top
    if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
        document.querySelector(".hovering_button").classList.add("show");  // Add the "show" class to the hovering button
    } 
    else {
        document.querySelector(".hovering_button").classList.remove("show");  // Remove the "show" class from the hovering button
    }
}

// Listens for a click event on the hovering button
document.querySelector('.hovering_button').addEventListener('click', function() {
    // When the hovering button is clicked, smoothly scroll the page back to the top
    window.scrollTo({
        top: 0, 
        behavior: 'smooth'
    });
});