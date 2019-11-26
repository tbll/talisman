//
//  ContentView.swift
//  Talisman
//
//  Created by Paul on 11/26/19.
//  Copyright © 2019 talisman. All rights reserved.
//

import SwiftUI
import FirebaseAuth;

struct ContentView: View {
  
  @State private var email: String = ""
  @State private var password: String = ""
  @State private var login_error: String? = nil
  @State private var logged_user: String? = nil
  @State private var connecting: Bool = false
  
  var body: some View {
    
    VStack {
      Image("logo")
        .resizable()
        .aspectRatio(contentMode: ContentMode.fit)
        .frame(width: CGFloat(74), height: CGFloat(74))
        .clipShape(Circle())
        .overlay(Circle().stroke(Color.white, lineWidth: CGFloat(2)))
        .shadow(radius: CGFloat(2))
      
      
      Text("Login").font(.title)
      
      Text("Talisman").font(.subheadline)
        .padding(EdgeInsets(
          top: CGFloat(0.0),
          leading: CGFloat(0.0),
          bottom: CGFloat(70.0),
          trailing: CGFloat(0.0)))
      
      if !connecting && logged_user == nil {
        TextField("Email", text: $email)
          .textContentType(.emailAddress)
          .padding()
          .cornerRadius(CGFloat(4.0))
          .padding(EdgeInsets(
            top: CGFloat(0),
            leading: CGFloat(0),
            bottom: CGFloat(15),
            trailing: CGFloat(0)))
        
        SecureField("Password", text: $password)
          .padding()
          .cornerRadius(CGFloat(4.0))
          .padding(.bottom, CGFloat(10))
      }
      
      if login_error != nil {
        Text(login_error!)
          .foregroundColor(.red)
          .padding(.bottom, CGFloat(10))
      }
      
      if logged_user != nil {
        Text("Logged as " + logged_user!)
          .foregroundColor(.green)
          .padding(.bottom, CGFloat(10))
        
        Button(action: {
          self.connecting = true
          self.login_error = nil;
          do {
            try Auth.auth().signOut()
          } catch {
            self.login_error = "Can't log out"
          }
        }) {
          Text("Logout")
        }
      }
      
      if connecting {
        Text("Connecting…")
          .padding(.bottom, CGFloat(10))
      }
      
      if logged_user == nil && !connecting {
        Button(action: {
          self.connecting = true;
          self.login_error = nil;
          Auth.auth().signIn(
            withEmail: self.email,
            password: self.password,
            completion: {(res, error) in
              self.connecting = false;
              if let error = error {
                self.login_error = error.localizedDescription
              } else {
                self.login_error = nil
              }
          }
          )
        }) {
          Text("Signing in")
        }
      }
      
    }.padding().onAppear {
      let _ = Auth.auth().addStateDidChangeListener({ (_, user) in
        print("STATE CHANGED");
        self.connecting = false;
        if let user = user {
          if let email = user.email {
            self.logged_user = email
          } else {
            self.logged_user = "unknown"
          }
        } else {
          self.logged_user = nil;
        }
      });
    }
    
  }
}

struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    ContentView()
  }
}
