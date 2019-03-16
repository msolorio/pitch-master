import React from 'react';
import NavigationButton from './NavigationButton';

export default function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <NavigationButton
            content="Record Video"
            viewToShow="recordVideo"/>
        </li>
        <li>
          <NavigationButton
            content="Video List"
            viewToShow="sendVideo"/>
        </li>
      </ul>
    </nav>
  );
}